import {onNewUser} from "./new_user";
import {onNewEvent} from "./new_event";
import {confirmEventParticipation} from "./confirm_event_participation";
import {initializeApp} from "firebase-admin/app";
import {onNewEventParticipation} from "./new_event_participation";
import {onDeletedEventParticipation} from "./deleted_event_participation";
import {userChallengeUpdate} from "./user_update_challenge";
import {onUserProgressUpdate} from "./update_user_progress";

initializeApp();

exports.onNewUser = onNewUser;
exports.onNewEvent = onNewEvent;
exports.confirmEventParticipation = confirmEventParticipation;
exports.onNewEventParticipation = onNewEventParticipation;
exports.onDeletedEventParticipation = onDeletedEventParticipation;
exports.userChallengeUpdate = userChallengeUpdate;
exports.onUserProgressUpdate = onUserProgressUpdate;
