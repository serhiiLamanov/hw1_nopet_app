export default class ViewNotes{
    #CATEGORIES = ["Task", "Random Thought", "Idea", "Quote"]
    #tbodyNotes
    #tbodySummary
    #clickEvents
    constructor(root, clickEvents, notes=[], summaries){
        this.#clickEvents = clickEvents

        const html = `
        <table>
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
               ${notes.reduce((acc,curr) => acc+this.#createRowNote(curr),'')}
            </tbody>
            <tfoot>
                <tr><td colspan="6"><button>Create note</button></td></tr>
            </tfoot>
        </table>
        <table>
            <thead><tr><th>Note category</th><th>Active</th><th>Archived</th></tr></thead>
            <tbody>
                ${this.#CATEGORIES.reduce((acc,curr) => acc+`<tr><td>${curr}</td><td>0</td><td>0</td></tr>`, "")}
            </tbody>
        </table>
        `
        root.insertAdjacentHTML('beforeend', html)

        const tbodies = root.querySelectorAll("tbody")
        this.#tbodyNotes = tbodies[0]
        this.#tbodySummary = tbodies[1]

        this.updateSummaries(summaries)

        root.querySelector("thead button").addEventListener('click', this.#showHideArchivedNotes);

        ["edit", "archive", "unarchive", "delete"].forEach(action =>{ 
            this[`click${action}Note`] = ({target}) => this.#clickEvents[action+"NoteProcessing"](this.#getNoteIndex(target))
            this.#tbodyNotes.querySelectorAll(`button.${action}-btn`).forEach(button => button.addEventListener('click', this[`click${action}Note`]))
        })
        
    }

    #createRowNote({name, created, category, content, archived}){
        const classArchived = archived ? " class='archived'" : ""
        return`
        <tr${classArchived}>
            <td>${name}</td><td>${created}</td><td>${this.#CATEGORIES[category]}</td><td>${content}</td><td>dates</td>
            <td>
                <button title="edit note" class="material-icons edit-btn">edit</button>
                <button title="archive note" class="material-icons archive-btn">archive</button>
                <button title="unarchive note" class="material-icons unarchive-btn">unarchive</button>
                <button title="delete note" class="material-icons delete-btn">delete</button>
            </td>    
        </tr>`
    }
    // #createRowCategory(name, {active, archived}){
    //     return `<tr><td>${name}</td><td>${active}</td><td>${archived}</td></tr>`
    // }
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
    updateNode(index, {name, created, category, content, archived}){
        const cells = this.#tbodyNotes.rows[index].cells
        cells[0].innerHTML = name
        cells[1].innerHTML = created
        cells[2].innerHTML = this.#CATEGORIES[category]
        cells[3].innerHTML = content
        // cells[4].innerHTML = name
    }
}