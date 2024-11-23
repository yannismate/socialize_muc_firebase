import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {getFirestore} from "firebase-admin/firestore";

export const onNewEvent = onDocumentCreated("/event/{eId}", async (event) => {
  logger.info("Creating event", {eventId: event.params.eId});

  await event.data?.ref?.update({
    num_participants: 0,
  });

  await getFirestore()
    .collection("/event/" + event.params.eId + "/private").doc("code")
    .set({code: Math.random().toString().substring(2, 8)});
});
