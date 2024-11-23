import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;

initializeApp();

interface ChallengeProgress {
  challenge: DocumentReference;
  progress: number;
  current_streak: number;
}

export const onNewUser = onDocumentCreated("/user/{userId}", async (event) => {
  logger.info("Creating user", {userId: event.params.userId});
  const challenges = await getFirestore().collection("challenge").get();

  const userChallengeProgress: ChallengeProgress[] = [];
  challenges.forEach((ch) => {
    if (ch.data()["type"] == "PROGRESS") {
      if (ch.data()["level"] == 0) {
        userChallengeProgress.push({
          challenge: ch.ref,
          progress: 0,
          current_streak: 0,
        });
      }
    } else {
      userChallengeProgress.push({
        challenge: ch.ref,
        progress: 0,
        current_streak: 0,
      });
    }
  });

  await event.data?.ref?.update({
    achievements: [],
    level: 0,
    challenge_progress: userChallengeProgress,
  });
});
