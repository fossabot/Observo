//Example (Client) Page
Observo.onMount((imports) => {
    console.log(imports)
})
Observo.onCustomMount((custom) => {
    console.log(custom)
    for (let plugin in custom.plugins) {
        console.log(plugin)
        custom.plugins[plugin].CLIENT.loadPage()
    }
})
Observo.register(null, () => {
   GLOBAL: {
       cheese: () => {
           console.log("Cheese")
       }
   }
})

