import {getFirestore} from "firebase-admin/firestore";
import {https, logger} from "firebase-functions/v2";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import {CallableRequest} from "firebase-functions/lib/common/providers/https";

interface UserCompleteChallengeResponse {
  WasCompleted: boolean;
  Error: string;
}

interface ChallengeProgress {
  challenge: DocumentReference;
  progress: number;
  current_streak: number;
}

export const userChallengeUpdate = https.onCall(async (request: CallableRequest) : Promise<UserCompleteChallengeResponse> => {
  if (!request.auth) {
    return {WasCompleted: false, Error: "Not authenticated"};
  }

  const uid = request.auth.uid;
  const challengeId = request.data["challengeId"]?.toString();
  const progress = request.data["progress"]?.toString();
  if (!challengeId || !progress) {
    return {WasCompleted: false, Error: "Missing challengeId or progress"};
  }

  logger.info("Challenge user update", {user: request.auth.uid, challengeId: challengeId, progress: progress});

  const challenge = await getFirestore().collection("challenge").doc(challengeId).get();
  if (!challenge.exists) {
    return {WasCompleted: false, Error: "Challenge not found"};
  }
  if (!challenge.data()?.["is_user_completable"]) {
    return {WasCompleted: false, Error: "Challenge is not user-completable"};
  }

  const userProgress = await getFirestore().collection("user/" + request.auth.uid + "/private").doc("progress").get();

  let challengeProgress: ChallengeProgress[] = userProgress.data()?.["challenge_progress"] ?? [];
  challengeProgress = challengeProgress.map((ch) => {
    if (ch.challenge.id != uid || progress <= ch.progress) {
      return ch;
    }
    ch.progress = progress;
    if (ch.progress == challenge.data()?.["max_progress"] ?? 0) {
      ch.current_streak += 1;
    }
    return ch;
  });

  await userProgress.ref?.update({
    challenge_progress: challengeProgress,
  });

  return {WasCompleted: true, Error: ""};
});
