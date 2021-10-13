import {CATEGORIES} from './CATEGORIES.js'
export default class ViewNotes{
    #NOTE_ACTIONS = ["edit", "archive", "unarchive", "delete"]
    #tbodyNotes
    #tbodySummary
    constructor(root, clickEvents, notes=[], summaries){
        this.#NOTE_ACTIONS.forEach(action => this[`click${action}Note`] = ({target}) => clickEvents[action+"NoteProcessing"](this.#getNoteIndex(target)))
        const html = `<table>
                        <thead>
                            <tr>
                                <th>Name</th><th>Created</th><th>Category</th><th>Content</th><th>Dates</th>
                                <th>
                                    <button title="show archived notes" class="material-icons">archive</button>
                                    <button title="delete all notes (not implemented)" class="material-icons">delete</button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        </tbody>
                        <tfoot>
                            <tr><td colspan="6"><button>Create note</button></td></tr>
                        </tfoot>
                    </table>
                    <table>
                        <thead><tr><th>Note category</th><th>Active</th><th>Archived</th></tr></thead>
                        <tbody>
                            ${CATEGORIES.reduce((acc,curr) => acc+`<tr><td>${curr}</td><td>0</td><td>0</td></tr>`, "")}
                        </tbody>
                    </table>`
        
        root.insertAdjacentHTML('beforeend', html)

        const tbodies = root.querySelectorAll("tbody")
        this.#tbodyNotes = tbodies[0]
        this.#tbodySummary = tbodies[1]
        this.#tbodyNotes.append(...notes.map(note =>this.#renderRowNote(note)))
        this.updateSummaries(summaries)

        root.querySelector("thead button").addEventListener('click', this.#showHideArchivedNotes)
        root.querySelector("tfoot button").addEventListener('click', clickEvents.newNoteCreating)
    }

    #renderRowNote({name, created, category, content, archived}){
        const DATE_OPTIONS = {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }
        const row = document.createElement("tr")
        if(archived)
            row.className = ("archived")
        
        const html = `<td>${name}</td><td>${new Date(created).toLocaleDateString('en-US', DATE_OPTIONS)}</td><td>${CATEGORIES[category]}</td><td>${content}</td><td>dates</td>`
        row.insertAdjacentHTML('beforeend',html)

        const btnCell = document.createElement("td")
        this.#NOTE_ACTIONS.forEach(action =>{
            const btn = document.createElement("button")
            btn.innerText = action
            btn.title = action + " note"
            btn.className = `material-icons ${action}-btn`
            btn.addEventListener('click', this[`click${action}Note`])
            btnCell.appendChild(btn)
        })
        row.appendChild(btnCell)
        return row
    }
    
    #showHideArchivedNotes = () => this.#tbodyNotes.classList.toggle("showArchived")

    #getNoteIndex = element => [...this.#tbodyNotes.rows].indexOf(element.closest('tr'))

    updateSummaries(summaries){
        for(let i=0; i<summaries.length; i++){
            this.updateSummary(i, summaries[i])
        }
    }
    updateSummary(i, summary){
        this.#tbodySummary.rows[i].cells[1].innerHTML = summary.active
        this.#tbodySummary.rows[i].cells[2].innerHTML = summary.archived
    }

    deleteNote(index){
        this.#tbodyNotes.rows[index].remove()
    }
    archiveNote(index){
        this.#tbodyNotes.rows[index].classList.add("archived")
    }
    unarchiveNote(index){
        this.#tbodyNotes.rows[index].classList.remove("archived")
    }
    updateNote(index, {name, created, category, content, archived}){
        const row = this.#tbodyNotes.rows[index]
        archived ? row.classList.add("archived") : row.classList.remove("archived")
        
        const cells = row.cells
        cells[0].innerHTML = name
        cells[1].innerHTML = created
        cells[2].innerHTML = CATEGORIES[category]
        cells[3].innerHTML = content
        // cells[4].innerHTML = name
    }
    addNote(note){
        this.#tbodyNotes.append(this.#renderRowNote(note))
    }
}