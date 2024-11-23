import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import FieldValue = firestore.FieldValue;

export const onNewEventParticipation = onDocumentCreated("/event_participation/{epId}", async (event) => {
  logger.info("Creating event participation", {eventId: event.params.epId});

  const dbEventRef: DocumentReference = event.data?.data().event;

  await dbEventRef.update({
    num_participants: FieldValue.increment(1),
  });

  const exists = (await getFirestore().collection("event_participation")
    .where("user", "==", event.data?.data()?.user)
    .where("event", "==", event.data?.data()?.event).count().get()).data().count > 1;

  if (exists) {
    await getFirestore().collection("event_participation").doc(event.params.epId).delete();
    return;
  }
});
