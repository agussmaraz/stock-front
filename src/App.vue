<template>
    <div id="app">
        <ul type="none" class="lista-nav">
            <li><router-link to="/">Home</router-link> |</li>
            <li><router-link to="/about">Estadisticas</router-link> |</li>
            <li><router-link to="/comida-nueva"> Agregar comidas</router-link> |</li>
            <li><router-link to="/comidas"> Comidas</router-link> |</li>
            <li><router-link to="/register"> Register </router-link></li>
        </ul>
        <router-view />
    </div>
</template>
<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .lista-nav {
        padding: 30px;
        display: flex;
        justify-content: center;
    }

    .lista-nav a {
        font-weight: bold;
        color: #2c3e50;
    }
    .lista-nav a:hover {
        text-decoration: none;
        color: #2c3e50;
        font-weight: bold;
    }

    .lista-nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
