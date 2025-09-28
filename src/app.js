import validationSchema from './validator.js'
import initView from './view.js'

export default function app() {
  const state = {
    form: {
      error: null,
      valid: false,
    },
    feeds: [],
    posts: [],
  }

  const watchedState = initView(state)
  const form = document.querySelector('.rss-form')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const url = formData.get('url')
    const inputUrls = watchedState.feeds.map(feed => feed.url)
    const schema = validationSchema(inputUrls)

    schema.validate(url)
      .then((validateUrl) => {
        watchedState.form.error = null
        watchedState.form.valid = true
        console.log(`Валидация успешна${validateUrl}`)
      })
      .catch((error) => {
        watchedState.form.valid = false
        watchedState.form.error = error.message
      })
  })
};
