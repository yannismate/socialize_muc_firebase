import {onDocumentDeleted} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {firestore} from "firebase-admin";
import DocumentReference = firestore.DocumentReference;
import FieldValue = firestore.FieldValue;

export const onDeletedEventParticipation = onDocumentDeleted("/event_participation/{epId}", async (event) => {
  logger.info("Removing event participation", {eventId: event.params.epId});

  const dbEventRef: DocumentReference = event.data?.data().event;

  await dbEventRef.update({
    num_participants: FieldValue.increment(-1),
  });
});
