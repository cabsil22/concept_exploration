        const debug = false
        const outputElements = []
        const dataSourceArrays = []
        const registeredUserMethods = []
        dataSourceArrays.push(outputElements)
        eventLoopTick = () => {
            outputElements.forEach((outputElement) => {
                outputElement.render()
            })
        }

        eventLoopTriggerMethod = (event) => {
            sender = event.srcElement
            if (debug == true) {
            console.log(event.type, ':', sender)
            }
            eventLoopTick()
        }

        registerElements = (parent) => {
            try {
                
           
            hasDataBinding = parent.hasAttribute('data-bind-type')

            if (hasDataBinding != false) {
                dataBindingType = parent.getAttribute('data-bind-type')
                switch (dataBindingType) {
                    case 'button':
                        try {
                            dataBindingMethod = parent.getAttribute('data-bind-method');
                            boundMethod = registeredUserMethods[dataBindingMethod];
                            parent.addEventListener('click', boundMethod);
                        } catch (error) {
                            console.log('Something went wrong binding the button to method: ', dataBindingMethod)
                        }
                   
                        break
                    case 'text':
                        parent.addEventListener('input', eventLoopTriggerMethod)
                        break
                    case 'output':
                        try {
                            dataBindingSourceID = parent.getAttribute('data-bind-source')
                            dataBindingSourceElement = document.getElementById(dataBindingSourceID)
                            let outputElement = new OutputElement(parent, dataBindingSourceElement)
                            outputElements.push(outputElement)
                            outputElement.render()
                        } catch (error) {
                            console.log(error)
                            console.log('Did you forget to give the output element a data-binding-source element?')
                        }
                        break
                    case 'boundList':
                        try {
                            //bind the list to an array
                            dataBindingSourceArray = parent.getAttribute('data-bind-source')
                            dataSourceArrays['list'+dataBindingSourceArray] = []
                            dataSourceArray = dataSourceArrays['list'+dataBindingSourceArray]
                            let boundList = new OutputBoundList(parent, dataSourceArray)
                            outputElements.push(boundList)
                            boundList.render()
                        } catch (error) {
                            console.log('something went wrong when bind the list to: ', dataSourceArray)
                            console.log(error)
                        }
                        break
                }

                
            }
            if (parent.children.length == 0) {
                return
            }
            Array.from(parent.children).forEach(element => {
                registerElements(element)
            });
             } catch (error) {
                // catch any errors and tell us what they are
                console.log(error)
                // log the element that was being inspected at the time of the error.
                console.log('resulting element was: ', parent)
            }
        }

        registerMethod = (name, methodReference) => {
            registeredUserMethods[name] = (event) => {
                methodReference(event);
                eventLoopTriggerMethod(event);
            }
        }

        getBoundArray = (name) => {
            boundArrayObj = dataSourceArrays['list'+name]
            boundArrayObj.removeItem = (index) => {
                boundArrayObj.splice(index, 1);
            }
            return boundArrayObj
        }

        getInputValue = (name) => {
            return document.getElementById(name).value

        }

      

        startApp = (elementID) => {
            appElement = document.getElementById(elementID)
            registerElements(appElement)

        }
