import request from '../lib/request';

function list(userId) {
    return request({
        url: `services/${userId}`,
        method: 'GET'
    });
}

function store(objService) {
    return request({
        url: 'service',
        method: 'POST',
        data: objService
    });
}

const ServicesService = {
    list,
    store
}

export default ServicesService;