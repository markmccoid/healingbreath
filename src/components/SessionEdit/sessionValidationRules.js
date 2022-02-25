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
  breathRounds: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
  breathReps: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
  recoveryHoldTime: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
  retentionHoldTimes: yup.array().of(
    yup.object().shape({
      holdTime: yup
        .number()
        .typeError("Must be a number")
        .required("Hold Time is required")
        .integer("Hold Time must be an integer")
        .positive("Hold Time must be positive"),
    })
  ),
  alerts: alertValidationSchema,
});
