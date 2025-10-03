// a class structure to hold the output element itself and the source that it wants to watch for data changes.
// I think I should be able to override the render() method later to have more complex output types. 

class OutputElement {
            constructor(element, dataSource) {
                this.element = element
                this.dataSource = dataSource
            }

            render(){
                this.element.innerHTML = this.dataSource.value
            }
}

class OutputBoundList extends OutputElement {
    constructor(element, dataSource){
        console.log(dataSource)
        super(element, dataSource)
        this.listItems = []
    }
    
    render(){
        this.listItems = []
        this.element.innerHTML = "";
        this.dataSource.forEach(element => {
            
            let newlistItem = this.createListItem(element)
            this.listItems.push(newlistItem)
            
        });
        this.listItems.forEach(item => {
            this.element.appendChild(item)
        });
    }

    // simple text list
    // createListItem(text, link = "#"){
    //     let newListItem = document.createElement("li")
    //     let listItemLink = document.createElement('a')
    //     listItemLink.href = link
    //     listItemLink.textContent = text
    //     newListItem.appendChild(listItemLink)
    //     return newListItem
    // }

    createListItem(childElement){
        let newListItem = document.createElement("li")
        if (typeof childElement == 'object'){
            newListItem.appendChild(childElement)
        }
        else {
            let listItemLink = document.createElement('a')
            listItemLink.textContent = childElement
            newListItem.appendChild(listItemLink)
        }
        return newListItem
    }
}