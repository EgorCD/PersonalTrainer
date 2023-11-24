const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL_TRAININGS = import.meta.env.VITE_API_URL_TRAININGS;

export const fetchCustomers = () => {
    return fetch(`${API_BASE_URL}/customers?timezoneOffset=${timeZoneOffset}`)
        .then(response => {
            if (!response.ok) throw new Error("Something went wrong: " + response.statusText);
            return response.json();
        });
};

export const deleteCustomer = (customerId) => {
    const url = `${API_BASE_URL}/customers/${customerId}`;
    return fetch(url, { method: 'DELETE' });
};

export const updateCustomer = (customer, customerId) => {
    const url = `${API_BASE_URL}/customers/${customerId}`;
    return fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
};

export const saveCustomer = (customer) => {
    return fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
};

export const fetchTrainings = () => {
    return fetch(`${API_BASE_URL_TRAININGS}/gettrainings?timezoneOffset=${timeZoneOffset}`)
        .then(response => response.json());
};

export const addTraining = (newTraining) => {
    return fetch(`${API_BASE_URL}/trainings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTraining)
    });
};

export const updateTraining = (training, trainingId) => {
    return fetch(`${API_BASE_URL}/trainings/${trainingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(training)
    });
};

export const deleteTraining = (trainingId) => {
    const url = `${API_BASE_URL}/trainings/${trainingId}`;
    return fetch(url, { method: 'DELETE' });
};
