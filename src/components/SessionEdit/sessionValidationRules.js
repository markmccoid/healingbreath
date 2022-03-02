import * as yup from "yup";

const alertValueValidation = yup
  .number()
  .typeError("Must Be a number")
  .required("Required, enter 0 to turn OFF this alert")
  .integer("Must be an integer")
  .min(0);

const alertValidationSchema = yup.object().shape({
  ConsciousForcedBreathing: yup.object().shape({
    alertEveryXBreaths: yup.object().shape({
      value: alertValueValidation,
    }),
    alertXBreathsBeforeEnd: yup.object().shape({
      value: alertValueValidation,
    }),
  }),
  BreathRetention: yup.object().shape({
    alertEveryXSeconds: yup.object().shape({
      value: alertValueValidation,
    }),
    alertXSecondsBeforeEnd: yup.object().shape({
      value: alertValueValidation,
    }),
  }),
  RecoveryBreath: yup.object().shape({
    alertEveryXSeconds: yup.object().shape({
      value: alertValueValidation,
    }),
    alertXSecondsBeforeEnd: yup.object().shape({
      value: alertValueValidation,
    }),
  }),
});

export const sessionValidationSchema = yup.object({
  name: yup.string().required(),
  inhaleTime: yup.number().typeError("Number").required("Required").positive("> zero"),
  exhaleTime: yup.number().typeError("Number").required("Required").positive("> zero"),
  actionPauseTimeIn: yup.number().typeError("Number").required("Required").positive("> zero"),
  actionPauseTimeOut: yup.number().typeError("Number").required("Required").positive("> zero"),
  breathRounds: yup
    .number()
    .typeError("> zero")
    .required("Required")
    .integer("Integer")
    .positive("> zero"),
  breathReps: yup
    .number()
    .typeError("> zero")
    .required("Required")
    .integer("Integer")
    .positive("> zero"),
  recoveryHoldTime: yup
    .number()
    .typeError("Number")
    .required("Required")
    .integer("Integer")
    .positive("> zero"),
  retentionHoldTimes: yup.array().of(
    yup.object().shape({
      holdTime: yup
        .number()
        .typeError("Number")
        .required("Required")
        .integer("Integer")
        .positive("> zero"),
    })
  ),
  alerts: alertValidationSchema,
});
