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
  watchedState.form.status = 'loading'

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
        description: post.description,
        read: false,
      }))
      watchedState.posts.unshift(...newPosts)
      watchedState.form.error = null
      watchedState.form.valid = true
    })
    .catch((error) => {
      watchedState.form.valid = false
      watchedState.form.error = error.message
    })
    .finally(() => {
      watchedState.form.status = 'filling'
    })
}

const UPDATE_INTERVAL = 5000

function updateFeeds(watchedState) {
  const { feeds, posts } = watchedState
  const existingLinks = new Set(posts.map(post => post.link))

  const promises = feeds.map((feed) => {
    return loadRss(feed.url)
      .then(rssString => parseRss(rssString))
      .then((parsedData) => {
        const newPostsRaw = parsedData.posts
          .filter(post => !existingLinks.has(post.link))

        if (newPostsRaw.length > 0) {
          const newPosts = newPostsRaw.map(post => ({
            id: _.uniqueId('post_'),
            feedId: feed.id,
            title: post.title,
            link: post.link,
            description: post.description,
            read: false,
          }))

          watchedState.posts.unshift(...newPosts)
        }
      })
      .catch((error) => {
        console.error(`Ошибка при обновлении фида: ${feed.url}`, error)
      })
  })

  Promise.allSettled(promises)
    .finally(() => {
      setTimeout(() => updateFeeds(watchedState), UPDATE_INTERVAL)
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
  }).then(() => {
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
        status: 'filling',
      },
      feeds: [],
      posts: [],
      ui: {
        readPosts: new Set(),
      },
    }

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      h1: document.querySelector('h1'),
      p: document.querySelector('p.lead'),
      posts: document.querySelector('.posts'),
      feeds: document.querySelector('.feeds'),
      modal: document.querySelector('.modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalArticle: document.querySelector('.full-article'),
      submitButton: document.querySelector('button[type="submit"]'),
    }

    elements.h1.textContent = i18nextInstance.t('title')
    elements.p.textContent = i18nextInstance.t('description')

    const watchedState = initView(state, elements, i18nextInstance)

    elements.form.addEventListener('submit', (event) => {
      handleFormSubmit(event, watchedState)
    })

    elements.modal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget
      const postId = button.dataset.id

      if (!postId) {
        return
      }

      const postToDisplay = state.posts.find(post => post.id === postId)

      elements.modalTitle.textContent = postToDisplay.title
      elements.modalBody.textContent = postToDisplay.description
      elements.modalArticle.href = postToDisplay.link
      watchedState.ui.readPosts.add(postId)
    })

    updateFeeds(watchedState)
  }).catch((error) => {
    console.error('Ошибка инициализации i18next:', error)
  })
};
