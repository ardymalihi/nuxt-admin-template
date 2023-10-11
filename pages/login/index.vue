<template>
    <div class="bg-gray-800 flex items-center justify-center h-screen">
        <div class="mb-10 mr-10 mt-10 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-100 p-5 shadow-sm">
            <div class="text-lg text-center">Login</div>
            <form action="" class="">
                <div class="mb-4 flex flex-col gap-5">
                    <div>
                        <label class="p-1 text-xs" for="email">email</label>
                        <input class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" id="username"
                            type="text" placeholder="email" />
                    </div>
                    <div>
                        <label class="p-1 text-xs" for="password">password</label>
                        <input class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" id="username"
                            type="password" placeholder="password" />
                    </div>
                    <div class="w-full text-center">
                        <a class="text-xs text-blue-500 hover:text-blue-700" href="/forgot">Forgot password?</a>
                    </div>
                    <div>
                        <button
                            class="w-full focus:shadow-outline rounded bg-blue-500 px-2 py-2 text-white hover:bg-blue-700 focus:outline-none">Login</button>
                    </div>
                    <div class="w-full text-center">
                        <span class="text-xs">Don't have an account? </span><a class="text-xs text-blue-500 hover:text-blue-700" href="/signup">Signup</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
