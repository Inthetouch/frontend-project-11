import * as yup from 'yup'

export default function validationSchema(inputUrls) {
  return yup.string()
    .required()
    .url()
    .trim()
    .notOneOf(inputUrls)
}
