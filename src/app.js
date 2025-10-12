import validationSchema from './validator.js'
import initView from './view.js'
import i18next from 'i18next'
import texts from './locales/ru.js'
import * as yup from 'yup'

export default function app() {
  const i18nextInstance = i18next.createInstance()
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: texts,
    },
  })

  yup.setLocale({
    string: {
      url: 'notUrl',
    },
    mixed: {
      required: 'required',
      notOneOf: 'duplicate',
    },
  })

  const state = {
    form: {
      error: null,
      valid: false,
    },
    feeds: [],
    posts: [],
  }

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    h1: document.querySelector('h1'),
    p: document.querySelector('p.lead'),
  }

  elements.h1.textContent = i18nextInstance.t('title')
  elements.p.textContent = i18nextInstance.t('description')

  const watchedState = initView(state, elements, i18nextInstance)

  elements.form.addEventListener('submit', (event) => {
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
