import onChange from 'on-change'

const renderError = (elements, error, i18nextInstance) => {
  if (error) {
    elements.input.classList.add('is-invalid')
    elements.feedback.classList.remove('text-success')
    elements.feedback.classList.add('text-danger')
    elements.feedback.textContent = i18nextInstance.t(error)
  }
  else {
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = ''
  }
}

const renderSuccess = (elements, i18nextInstance) => {
  elements.input.classList.remove('is-invalid')
  elements.feedback.classList.remove('text-danger')
  elements.feedback.classList.add('text-success')
  elements.feedback.textContent = i18nextInstance.t('success')
  elements.form.reset()
  elements.input.focus()
}

export default function initView(state, elements, i18nextInstance) {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.error':
        renderError(elements, value, i18nextInstance)
        break
      case 'form.valid':
        if (value === true) {
          renderSuccess(elements, i18nextInstance)
        }
        break
      default:
        break
    }
  })
  return watchedState
};
