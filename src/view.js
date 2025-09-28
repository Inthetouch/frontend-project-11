import onChange from 'on-change'

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
}

const renderError = (error) => {
  if (error) {
    elements.input.classList.add('is-invalid')
    elements.feedback.classList.remove('text-success')
    elements.feedback.classList.add('text-danger')
    elements.feedback.textContent = error
  }
  else {
    elements.input.classList.remove('is-invalid')
    elements.feedback.textContent = ''
  }
}

const renderSuccess = () => {
  elements.input.classList.remove('is-invalid')
  elements.feedback.classList.remove('text-danger')
  elements.feedback.classList.add('text-suuccess')
  elements.feedback.textContent = 'RSS успешно загружен'
}

export function initView(state) {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.error':
        renderError(value)
        break
      case 'form.valid':
        if (value === true) {
          renderSuccess()
          elements.form.reset()
          elements.form.focus()
        }
        break
      default:
        break
    }
  })
  return watchedState
};
