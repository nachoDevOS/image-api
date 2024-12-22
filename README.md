<h1 align="center">Images Generator from URL</h1>

Paquete para generar imágenes a partir de una página web.

## Install
```sh
npm i
```
## Config
```sh
cp .env-example .env

# Edit environment variables
URL="localhost" # your domain
PORT=3000 # your port
```

## Start
```sh
npm start
```

## Routes
<table>
    <tr>
        <th>TYPE</th>
        <th>ROUTE</th>
        <th>RETURN</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/</td>
        <td>{"status": 1, "message": "Welcome to ImagesGeneratorFromUrl!"}</td>
    </tr>
    <tr>
        <td>get</td>
        <td>/generate?url=http://my_image_url</td>
        <td>{"url": image_path}</td>
    </tr>
</table>

## Credits
<a href="https://twitter.com/AgustinMejiaM" target="_blank">@IgnacioMolinaGuzman</a>  -   Developer