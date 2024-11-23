import {getFirestore} from "firebase-admin/firestore";
import {https, logger} from "firebase-functions/v2";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import {CallableRequest} from "firebase-functions/lib/common/providers/https";

interface ConfirmParticipationResponse {
  WasVerified: boolean;
  Error: string;
}

export const confirmEventParticipation = https.onCall(async (request: CallableRequest) : Promise<ConfirmParticipationResponse> => {
  if (!request.auth) {
    return {WasVerified: false, Error: "Not authenticated"};
  }

  const uid = request.auth.uid;
  const participationId = request.data["participationId"]?.toString();
  const code = request.data["code"]?.toString();

  if (!participationId || !code) {
    return {WasVerified: false, Error: "Missing participationId or code."};
  }

  logger.info("Confirming event participation", {participationId, code});

  const participation = await getFirestore().collection("event_participation").doc(participationId).get();
  if (!participation.exists) {
    return {WasVerified: false, Error: "Participation not found"};
  }

  const participationUserRef: DocumentReference = participation.data()?.user;
  const participationEventRef: DocumentReference = participation.data()?.event;
  if (participationUserRef?.id != uid) {
    return {WasVerified: false, Error: "User cannot update this participation."};
  }

  const eventCode = (await getFirestore()
    .collection("event/" + participationEventRef.id + "/private")
    .doc("code").get()).data()?.code;

  if (code != eventCode) {
    return {WasVerified: false, Error: "Invalid event code!"};
  }

  await participation.ref.update({
    was_verified: true,
  });
  return {WasVerified: true, Error: ""};
});
