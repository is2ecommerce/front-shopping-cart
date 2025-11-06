# ShoppingCart

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Docker — cómo arrancar desde Docker

Producción (SSR)

 Construir la imagen
 ```bash
docker build -t front-shopping-cart:latest .
```

Arrancar el contenedor (puerto 4040)
```bash
docker run --rm -p 4040:4040 --name front-shopping-cart front-shopping-cart:latest
```
 Si usas otro puerto (por ejemplo, 8080)
 ```bash
docker run -e PORT=8080 -p 8080:8080 front-shopping-cart:latest
```

 Desarrollo (ng serve)


Construir la imagen dev
```bash
docker build -f Dockerfile.dev -t front-shopping-cart:dev .
```

Arrancar el contenedor dev (puerto 4300)
```bash
docker run --rm -p 4300:4300 --name front-shopping-cart-dev front-shopping-cart:dev
```

 Con live-reload (montar el código como volumen)
```bash
docker run --rm -p 4300:4300 \
	-v "$(pwd)":/app \
	-v /app/node_modules \
	--name front-shopping-cart-dev front-shopping-cart:dev
```

 
 Comandos útiles
 
```bash
docker images                                          # Listar imágenes
docker image rm front-shopping-cart:dev                # Borrar imagen dev
docker tag front-shopping-cart:dev front-shopping-cart:latest  # Retag
docker ps -a --format 'table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}'  # Listar contenedores
docker logs -f <container-name-or-id>                  # Ver logs en tiempo real
```