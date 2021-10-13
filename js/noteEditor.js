import {CATEGORIES} from './CATEGORIES.js'
export default class{
    #editorsBackdrop
    #clb
    constructor(root, clb, {name, created, category, content, archived}={}){
        this.#clb = clb
        this.#editorsBackdrop = document.createElement("div")
        this.#editorsBackdrop.className = "editorsBackdrop"

        const html = `<form>
                            <div>
                            <label> Category
                                    ${this.#renderSelectCategory(category)}
                                </label>
                                <label>Name <input type="text" name="name" maxlength="20" required value="${name ?? ''}"></label>
                            </div>
                            <label>Content <input type="text" name="content" value="${content ?? ''}"></label>
                            <div>
                                <span>Created <input type="date" name="created" readonly value="${created ?? new Date().toISOString().slice(0, 10)}"></span>
                                <label>Archived<input type="checkbox" name="archived"${archived ? " checked" : ""}></label>
                            </div>
                            <div><input type="submit"> <input type="reset"> <input type="button" value="exit"></div>
                        </form>`      
        this.#editorsBackdrop.insertAdjacentHTML("afterbegin", html)

        this.#editorsBackdrop.querySelector("form").addEventListener("submit", this.#submitNote)
        this.#editorsBackdrop.querySelector("input[type='button']").addEventListener("click", this.#exit)
        
        root.appendChild(this.#editorsBackdrop)
    }

    #exit = () => this.#editorsBackdrop.remove()

    #submitNote = event =>{
        event.preventDefault()

        const note = Object.fromEntries(new FormData(event.target))
        note.archived = !!note.archived

        this.#exit()
        this.#clb(note)
    }

    #renderSelectCategory(category){
        let res = '<select name="category" required>'
        if(category === undefined)
            res += '<option selected disabled value="">choose category</option>'
        for(let i=0; i<CATEGORIES.length; i++){
            const selected = category == i ? " selected" : ""
            res += `<option value="${i}"${selected}>${CATEGORIES[i]}</option>`
        }
        res+="</select>"
        return res
    }
}