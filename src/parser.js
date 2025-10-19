export default (rssString) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(rssString, 'application/xml')

  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    throw new Error('parseError')
  }

  try {
    const feedTitle = xmlDoc.querySelector('channel title').textContent
    const feedDescription = xmlDoc.querySelector('channel description').textContent

    const itemElements = xmlDoc.querySelectorAll('item')
    const posts = Array.from(itemElements).map((item) => {
      const postTitle = item.querySelector('title').textContent
      const postLink = item.querySelector('link').textContent
      const postDescription = item.querySelector('description').textContent
      return { title: postTitle, link: postLink, description: postDescription }
    })

    return {
      title: feedTitle,
      description: feedDescription,
      posts,
    }
  }
  catch (e) {
    console.log(e)
    throw new Error('parseError')
  }
}
