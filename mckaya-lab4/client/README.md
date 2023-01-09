## Client

The client is a so called [single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application/) and is built using a javascript framework called [Vue.js](https://vuejs.org/).

### Files

As you can see there are quite a few files in this directory, however most of them are configuration files that you don't have to (nor is expected to) understand in order to complete the lab.

The files you should care about are located in the [src](./src/) (source) folder:

**main.js:** This is the entry file for your client. It takes care of setting up the Vue.js app that will run the rest of your code.

**App.vue:** This is the entry point of your Vue.js app. As you can see the file has the extension `.vue` instead of `.js`, this is to indicate that this file is in fact not strictly javascript, but in fact a [single-file component (SFC)](https://vuejs.org/guide/scaling-up/sfc.html/). If you open [App.vue](./src/App.vue) you will see that it looks quite like HTML.

**views/\*.vue:** These files define the views of your application. A view is what you in general would think of as a "page", it contains everything you see on the website (except the navigation which is defined in [App.vue](./src/App.vue)).

**router/index.js:** This file contains the logic that determine what view should be shown to the user depending on what URL the user has visited.

**store/index.js:** This file contains the global storage of your application. You can think of it as some sort of database that gets emptied whenever you reload the page. Its purpose is to make sure that the apps state is stored in a single place and not scattered to the four winds.

**assets/\*:** This is where you put any images or other none code assets that you want to include in your application.
