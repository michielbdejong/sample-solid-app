import ContactsModuleRdfLib from './node_modules/@solid-data-modules/contacts-rdflib/dist/index.js';
import {Fetcher, graph, UpdateManager} from "./node_modules/rdflib/dist/rdflib.min.js;

document.querySelector('list-address-books').onclick = async function () {
    const store = graph()
    const fetcher = new Fetcher(store)
    const updater = new UpdateManager(store)
    const contacts = new ContactsModuleRdfLib({store, fetcher, updater})
    
    const result = await contacts.listAddressBooks("http://localhost:3000/alice/profile/card#me")
    console.log(result)
    
    console.log("Note:\tFor the sake of this example, the settings document & private type index is publicly readable.")
    console.log("\tUsually you would have to use an authenticated fetch, to retrieve the private instances.")
    console.log("\tOtherwise the privateUris would just be an empty array, but the request would still work!")
}