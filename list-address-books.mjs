import ContactsModuleRdfLib from 'contacts-rdflib';
import { Fetcher, graph, UpdateManager } from "rdflib";
import solidAuthFetcher from "solid-auth-fetcher";

async function go() {
  console.log('go');
  const testUrl = document.getElementById('testUrl').value;
  const oidcIssuer = document.getElementById('oidcIssuer').value;
  document.getElementById('status').innerText = `Testing access to ${testUrl} using solid-auth-fetcher:`;
  const authFetcher = await solidAuthFetcher.customAuthFetcher();
  const result = await solidAuthFetcher.fetch(testUrl);
  document.getElementById('status').innerText += ` ${result.status}`;
  if (result.status === 401) {
    document.getElementById('status').innerText += ` -> logging in using ${oidcIssuer}!`;
    // Give the user time to read that before the redirect:
    await new Promise(resolve => setTimeout(resolve, 1000));
    const session = await authFetcher.login({
      oidcIssuer,
      redirect: location.href
    });
    // FIXME: avoid this hard-coded timeout
    // Without this you end up at http://localhost:5000/undefined
    await new Promise(resolve => setTimeout(resolve, 5000));
    window.location = session.neededAction.redirectUrl;
  }
}

async function listAddressBooks() {
  const store = graph()
  const fetcher = new Fetcher(store)
  const updater = new UpdateManager(store)
  const contacts = new ContactsModuleRdfLib({ store, fetcher, updater })

  const result = await contacts.listAddressBooks("http://localhost:3000/alice/profile/card#me")
  console.log(result)

  console.log("Note:\tFor the sake of this example, the settings document & private type index is publicly readable.")
  console.log("\tUsually you would have to use an authenticated fetch, to retrieve the private instances.")
  console.log("\tOtherwise the privateUris would just be an empty array, but the request would still work!")
}

document.onload(() => {
  console.log('onload');
  document.getElementById('go').onclick = go;
  document.querySelector('list-address-books').onclick = listAddressBooks;
});

console.log('mjs');