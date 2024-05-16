import { CURRENT_STATE_CONFIG, USER_ACCOUNT_STEPS } from "~/constants";
import { CurrentState, CurrentStateType } from "@prisma/client";

export const findNextState = (type: CurrentStateType): CurrentState | null => {
    const index = USER_ACCOUNT_STEPS.findIndex((currentT) => currentT === type);
    const nextStep = USER_ACCOUNT_STEPS[index + 1];
    if(nextStep) {
        return CURRENT_STATE_CONFIG[nextStep] || null
    }
    return null;
}