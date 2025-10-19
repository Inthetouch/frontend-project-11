export default (rssString) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(rssString, 'application/xml')

  const parseError = xmlDoc.querySelector('parseerror')
  if (parseError) {
    throw new Error(parseError.textContent)
  }

  const feedTitle = xmlDoc.querySelector('channel title').textContent
  const feedDescription = xmlDoc.querySelector('channel description').textContent
  const itemElements = xmlDoc.querySelectorAll('item')

  const posts = Array.from(itemElements).map((itemElement) => {
    const postTitle = itemElement.querySelector('title').textContent
    const postLink = itemElement.querySelector('link').textContent
    const postDescription = itemElement.querySelector('description').textContent
    return { title: postTitle, link: postLink, description: postDescription }
  })

  return {
    title: feedTitle,
    description: feedDescription,
    posts,
  }
}
