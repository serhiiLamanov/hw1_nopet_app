export default class{
    #notes
    constructor(notesList=[]){
        this.#notes = notesList
    }
    get notes(){
        return this.#notes
    }
    getNote(index){
        return this.#notes[index]
    }
    addNote(note){
        this.#notes.push(note)
    }
    deleteNote(i){
        this.#notes.splice(i,1)
    }
    updateNote(i, note){
        this.#notes[i] = note
    }
    archiveNote(index){
        this.#notes[index].archived = true
    }
    unarchiveNote(index){
        this.#notes[index].archived = false
    }

    get summaries(){
        const A = new Array(4)
        for(let i=0; i<A.length; i++){
            A[i] = {active:0, archived:0}
        }
        return this.#notes.reduce((acc, curr) => ++acc[curr.category][curr.archived ? "archived" : "active"] && acc, A)
    }

}