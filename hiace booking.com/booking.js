// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const bookingsList = document.getElementById('bookings');
    const seatsContainer = document.getElementById('seats');
    const seatSelect = document.getElementById('seat');
    const pickupSelect = document.getElementById('pickup');
    const dropSelect = document.getElementById('drop');

    const totalSeats = 16; // Total number of seats in the Hiace

    // List of districts in Nepal with some example coordinates (replace with actual coordinates)
    const districts = [
        { name: "Kathmandu", lat: 27.7172, lng: 85.3240 },
        { name: "Bhaktapur", lat: 27.6722, lng: 85.4298 },
        { name: "Lalitpur", lat: 27.6663, lng: 85.3240 },
        { name: "Sindhuli", lat: 27.2667, lng: 85.9667 },
        { name: "Dhalkebar", lat: 26.9196, lng: 85.8280 },
        { name: "Siraha", lat: 26.6548, lng: 86.2056 },
        { name: "Saptari", lat: 26.6482, lng: 86.7130 },
        { name: "Sunsari", lat: 26.6274, lng: 87.1750 },
        // Add all other districts here...
    ];

    // Populate district dropdowns
    const populateDistricts = () => {
        districts.forEach(district => {
            const optionPickup = document.createElement('option');
            optionPickup.value = district.name;
            optionPickup.textContent = district.name;
            pickupSelect.appendChild(optionPickup);

            const optionDrop = document.createElement('option');
            optionDrop.value = district.name;
            optionDrop.textContent = district.name;
            dropSelect.appendChild(optionDrop);
        });
    };

    // Load existing bookings from localStorage
    const loadBookings = () => {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.forEach(addBookingToList);
        updateSeatAvailability(bookings);
    };

    // Add booking to the list
    const addBookingToList = (booking) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${booking.name}</strong><br>
            Email: ${booking.email}<br>
            Date: ${booking.date}<br>
            Time: ${booking.time}<br>
            Pickup: ${booking.pickup}<br>
            Drop: ${booking.drop}<br>
            Destination: ${booking.destination}<br>
            Seat: ${booking.seat}
        `;
        bookingsList.appendChild(li);
    };

    // Update seat availability
    const updateSeatAvailability = (bookings) => {
        const bookedSeats = bookings.map(booking => booking.seat);
        seatsContainer.innerHTML = '';
        seatSelect.innerHTML = '';

        for (let i = 1; i <= totalSeats; i++) {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');
            seatDiv.textContent = i;

            if (bookedSeats.includes(i.toString())) {
                seatDiv.classList.add('booked');
            } else {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Seat ${i}`;
                seatSelect.appendChild(option);

                seatDiv.addEventListener('click', () => {
                    if (seatDiv.classList.contains('selected')) {
                        seatDiv.classList.remove('selected');
                        seatSelect.value = '';
                    } else {
                        document.querySelectorAll('.seat').forEach(seat => seat.classList.remove('selected'));
                        seatDiv.classList.add('selected');
                        seatSelect.value = i;
                    }
                });
            }

            seatsContainer.appendChild(seatDiv);
        }
    };

    // Handle form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const booking = {
            name: bookingForm.name.value,
            email: bookingForm.email.value,
            date: bookingForm.date.value,
            time: bookingForm.time.value,
            pickup: bookingForm.pickup.value,
            drop: bookingForm.drop.value,
            destination: bookingForm.destination.value,
            seat: bookingForm.seat.value
        };

        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Add booking to the list
        addBookingToList(booking);
        
        // Update seat availability
        updateSeatAvailability(bookings);
        
        // Clear the form
        bookingForm.reset();
        document.querySelectorAll('.seat').forEach(seat => seat.classList.remove('selected'));
    });

    // Initialize the map
    const initializeMap = () => {
        const map = L.map('map').setView([27.7172, 85.3240], 7); // Centered on Kathmandu

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        districts.forEach(district => {
            L.marker([district.lat, district.lng]).addTo(map)
                .bindPopup(district.name)
                .openPopup();
        });
    };

    // Initialize
    populateDistricts();
    loadBookings();
    initializeMap();
});
