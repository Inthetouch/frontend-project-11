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

function renderFeeds(elements, value, i18nextInstance) {
  elements.feeds.innerHTML = ''

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = i18nextInstance.t('feeds')

  cardBody.append(title)
  card.append(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')

  value.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')
    const h3 = document.createElement('h3')
    h3.classList.add('lead', 'm-0')
    h3.textContent = feed.title

    const p = document.createElement('p')
    p.classList.add('m-0', 'small', 'text-black-50')
    p.textContent = feed.description

    li.append(h3, p)
    list.append(li)
  })

  cardBody.append(list)
  elements.feeds.append(card)
}

function renderPosts(elements, value, i18nextInstance) {
  elements.posts.innerHTML = ''

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = i18nextInstance.t('posts')

  cardBody.append(title)
  card.append(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')

  value.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')
    const a = document.createElement('a')
    a.classList.add('fw-bold')
    a.href = post.link
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = post.title
    li.append(a)
    list.append(li)
  })
  cardBody.append(list)
  elements.posts.append(card)
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
      case 'feeds':
        renderFeeds(elements, value, i18nextInstance)
        break
      case 'posts':
        renderPosts(elements, value, i18nextInstance)
        break
      default:
        break
    }
  })
  return watchedState
};
