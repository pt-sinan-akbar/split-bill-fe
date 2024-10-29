<script setup lang="ts"></script>

<template>
    <ol class="flex items-center w-full">
        <li
            class="flex w-full items-center text-yellow-500 dark:text-yellow-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800"
        >
            <span
                class="flex items-center justify-center w-10 h-10 bg-primary-background rounded-full lg:h-12 lg:w-12 dark:bg-primary-background shrink-0"
            >
                <svg
                    class="w-3.5 h-3.5 text-light-text-color lg:w-4 lg:h-4 dark:text-yellow-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                    />
                </svg>
            </span>
        </li>
        <li
            class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700"
        >
            <span
                class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0"
            >
                <span class="rounded-full w-5 h-5 bg-primary-background"></span>
            </span>
        </li>
        <li class="flex items-center">
            <span
                class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0"
            >
                <span class="rounded-full w-5 h-5 bg-primary-background"></span>
            </span>
        </li>
    </ol>
</template>
