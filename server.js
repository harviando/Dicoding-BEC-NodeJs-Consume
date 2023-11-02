import Hapi from '@hapi/hapi'
import got from 'got';

const {
    ORDER_SERVICE_PORT = 4000,
    USER_SERVICE_PORT = 6000,
} = process.env;

const orderService = `http://localhost:${ORDER_SERVICE_PORT}`;
const userService = `http://localhost:${USER_SERVICE_PORT}`;


const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });
    await server.start();
    console.log(`Server is running on ${server.info.uri}`);

    server.route([
        {
            method: 'GET',
            path: '/{id}',
            handler: async (request, h) => {
                const { id } = request.params;


                try {
                    const [order, user] = await Promise.all([
                        got(`${orderService}/${id}`).json(),
                        got(`${userService}/${id}`).json(),
                    ]);


                    return {
                        id: order.id,
                        menu: order.menu,
                        user: user.name,
                    };
                } catch (error) {
                    if (!error.response) throw error;
                    if (error.response.statusCode === 400) {
                        return h.response({ message: 'bad request' }).code(400);
                    }
                    if (error.response.statusCode === 404) {
                        return h.response({ message: 'not found' }).code(404);
                    }


                    throw error;
                }
            },
        },
    ]);
};

init();