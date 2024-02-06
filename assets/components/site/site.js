import { getSelf, updateSelf, createLink } from '../../lib/api'
import { handleError } from '../../lib/errors'
import { Component } from '../component'
import { Link } from '../link/link'

export class Site extends Component {
  constructor() {
    super()
    this.fetchData()
  }
  set editing(bool) {
    if (bool) {
      this.classList.add('editing')
    } else {
      this.classList.remove('editing')
    }
  }
  get editing() {
    return this.classList.contains('editing')
  }
  async fetchData() {
    try {
      this.loading = true
      const self = await getSelf()
      this.data = self
    } catch (err) {
      handleError(err)
    } finally {
      this.loading = false
    }
  }
  moveLinkToBottom(link) {
    this.slots.links.appendChild(link)
  }

  async handleCreateLink() {
    try {
      const url = prompt('Enter a website or feed URL')

      if (!url) return

      this.loading = true
      const link = await createLink(url)
      Link.create(this.slots.links, link)
    } catch (err) {
      handleError(err)
    } finally {
      this.loading = false
    }
  }
  async handleRenameSiteClick() {
    try {
      const siteTitle = prompt('Enter a new title')

      if (!siteTitle) return

      this.loading = true
      const user = await updateSelf({ siteTitle })
      this.data = user
    } catch (err) {
      handleError(err)
    } finally {
      this.loading = false
    }
  }
  handleEditButtonClick() {
    const button = this.slots.edit
    if (this.editing) {
      button.textContent = 'Edit'
      this.editing = false
    } else {
      button.textContent = 'Done'
      this.editing = true
    }
  }

  render() {
    const data = this.data
    this.slots['site-title'].innerText = data.siteTitle
    document.head.querySelector('title').innerText = data.siteTitle
  }
  connectedCallback() {
    this.onRenameSiteClick = () => this.handleRenameSiteClick()
    this.slots['rename-site'].addEventListener('click', this.onRenameSiteClick)
    this.onEditClick = () => this.handleEditButtonClick()
    this.slots['edit'].addEventListener('click', this.onEditClick)
    this.onAddClick = () => this.handleCreateLink()
    this.slots['add'].addEventListener('click', this.onAddClick)
    this.onLinkClick = ({ target }) => this.moveLinkToBottom(target)
    this.addEventListener('link-click', this.onLinkClick)
  }
  disconnectedCallback() {
    this.slots['rename-site'].removeEventListener(
      'click',
      this.onRenameSiteClick
    )
    this.slots['edit'].removeEventListener('click', this.onEditClick)
    this.slots['add'].removeEventListener('click', this.onAddClick)
    this.removeEventListener('link-click', this.onLinkClick)
  }
}
customElements.define('linky-site', Site)
