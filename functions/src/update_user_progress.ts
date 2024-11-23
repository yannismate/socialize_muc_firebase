import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;

interface ChallengeProgress {
  challenge: DocumentReference;
  progress: number;
  current_streak: number;
}
export const onUserProgressUpdate = onDocumentUpdated("/user/{userId}/private/progress", async (event) => {
  logger.info("User progress updating...", {userId: event.params.userId});

  if (event.data?.after?.data()?.level != event.data?.before?.data()?.level) {
    logger.info("User progress updated skipped to prevent recursion...", {userId: event.params.userId});
    return;
  }

  const newProgress = event.data?.after?.data();
  if (!newProgress) {
    return;
  }
  const userChallengeProgress: ChallengeProgress[] = newProgress["challenge_progress"];

  let finishedProgressChallenges = 0;
  for (const ucp of userChallengeProgress) {
    const ch = (await ucp.challenge.get()).data();
    if (ucp.progress == ch?.["max_progress"] && ch?.type == "PROGRESS") {
      finishedProgressChallenges++;
    }
  }

  if (finishedProgressChallenges <= newProgress.level) {
    return;
  }
  newProgress.level = finishedProgressChallenges;

  const nextLevelChallenges = await getFirestore().collection("challenge").where("level", "==", newProgress.level).get();
  if (nextLevelChallenges.empty) {
    logger.info("User has reached max level", {userId: event.params.userId, newLevel: newProgress.level});
    return;
  }

  nextLevelChallenges.forEach((ch) => {
    userChallengeProgress.push({
      challenge: ch.ref,
      progress: 0,
      current_streak: 0,
    });
  });

  newProgress["challenge_progress"] = userChallengeProgress;
  await event.data?.after?.ref?.update(newProgress);
});
