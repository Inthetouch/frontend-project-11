import i18next from 'i18next'
import * as yup from 'yup'
import _ from 'lodash'
import texts from './locales/ru.js'
import initView from './view.js'
import validationSchema from './validator.js'
import loadRss from './api.js'
import parseRss from './parser.js'

function handleFormSubmit(event, watchedState) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const url = formData.get('url')

  const inputUrls = watchedState.feeds.map(feed => feed.url)
  const schema = validationSchema(inputUrls)

  schema.validate(url)
    .then((validateUrl) => {
      return loadRss(validateUrl)
        .then((rssString) => {
          return { rssString, validateUrl }
        })
    })
    .then(({ rssString, validateUrl }) => {
      const parsedData = parseRss(rssString)
      const feedId = _.uniqueId('feed_')
      const newFeed = {
        id: feedId,
        title: parsedData.title,
        description: parsedData.description,
        url: validateUrl,
      }
      watchedState.feeds.unshift(newFeed)
      const newPosts = parsedData.posts.map(post => ({
        id: _.uniqueId('post_'),
        feedId,
        title: post.title,
        link: post.link,
      }))
      watchedState.posts.unshift(...newPosts)
      watchedState.form.error = null
      watchedState.form.valid = true
    })
    .catch((error) => {
      watchedState.form.valid = false
      watchedState.form.error = error.message
    })
}

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
    handleFormSubmit(event, watchedState)
  })
};
