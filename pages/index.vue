<template>
    <!-- Home Section -->
    <section id="home" class="bg-blue-500 text-white py-20">
        <div class="container mx-auto text-center">
            <h1 class="text-4xl font-bold mb-4">Welcome to Our SAAS Product</h1>
            <p class="text-lg">Powerful solutions for your business needs.</p>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-semibold text-center mb-8">About Us</h2>
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-4 md:mb-0">
                    <p class="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae mauris non
                        tortor hendrerit iaculis.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="bg-gray-200 py-16">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-semibold text-center mb-8">Our Services</h2>
            <div class="flex flex-col md:flex-row justify-between items-center">
                <!-- Service Item 1 -->
                <div class="bg-white rounded-lg shadow-md p-4 text-center mb-4 md:w-1/3 m-5">
                    <h3 class="text-xl font-semibold mb-4">Service 1</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <!-- Service Item 2 -->
                <div class="bg-white rounded-lg shadow-md p-4 text-center mb-4 md:w-1/3 m-5">
                    <h3 class="text-xl font-semibold mb-4">Service 2</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <!-- Service Item 3 -->
                <!-- Service Item 1 -->
                <div class="bg-white rounded-lg shadow-md p-4 text-center mb-4 md:w-1/3 m-5">
                    <h3 class="text-xl font-semibold mb-4">Service 3</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-semibold text-center mb-8">Contact Us</h2>
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="md:w-1/2 mb-4 md:mb-0">
                    <form class="bg-white rounded-lg shadow-md p-4">
                        <h3 class="text-xl font-semibold mb-4">Get in Touch</h3>
                        <div class="mb-4">
                            <label for="name" class="block mb-2">Name:</label>
                            <input type="text" id="name" name="name" class="w-full border rounded-md py-2 px-3">
                        </div>
                        <div class="mb-4">
                            <label for="email" class="block mb-2">Email:</label>
                            <input type="email" id="email" name="email" class="w-full border rounded-md py-2 px-3">
                        </div>
                        <div class="mb-4">
                            <label for="message" class="block mb-2">Message:</label>
                            <textarea id="message" name="message" class="w-full border rounded-md py-2 px-3"></textarea>
                        </div>
                        <button type="submit" class="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600">Send
                            Message</button>
                    </form>
                </div>
                <div class="md:w-1/2 ml-5">
                    <p class="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae mauris non
                        tortor hendrerit iaculis.</p>
                </div>
            </div>
        </div>
    </section>
</template>
