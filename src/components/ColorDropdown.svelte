<script lang="ts">
  /**
   * Imports
   */

  import { DefaultColorsStore } from "../stores";
  import { createEventDispatcher } from "svelte";

  /**
   * Props
   */

  export let color: string;

  /**
   * Logic
   */

  // Variables that keep track of the state
  let isOpen = false;
  const colors = $DefaultColorsStore;

  // Dispatch function
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }
</script>

<div>
  <div>
    <button
      on:click={() => {
        isOpen = !isOpen;
      }}
      style="background-color:{color}"
    />
  </div>
  {#if isOpen}
    {#each colors as c}
      {#if c != color}
        <button
          on:click={() => {
            isOpen = !isOpen;
            color = c;
            dispatchUpdate();
          }}
          style="background-color:{c};"
        />
      {/if}
    {/each}
  {/if}
</div>

<style>
  button {
    display: block;
    width: 100%;
    height: 1em;
  }
</style>
