import * as yup from 'yup'

export default function validationSchema(inputUrl) {
  return yup.string()
    .required('Вы пропустили это поле')
    .url('Ссылка должна быть валидным URL')
    .trim()
    .notOneOf(inputUrl, 'Этот RSS уже добавлен')
}
