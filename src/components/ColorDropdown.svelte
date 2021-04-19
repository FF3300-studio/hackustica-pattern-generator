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
  export let label: string;

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

<div class="container">
  <!-- Label -->
  <p>{label}</p>

  <!-- Buttons -->
  <div class="buttons">
    <button
      on:click={() => {
        isOpen = !isOpen;
      }}
      class="color color-current"
      style="background-color:{color}"
    />
    {#if isOpen}
      <div class="options">
        {#each colors as c}
          {#if c != color}
            <div
              class="color color-option"
              on:click={() => {
                color = c;
                dispatchUpdate();
                isOpen = !isOpen;
              }}
              style="background-color:{c};"
            />
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  .options {
    background-color: var(--cds-ui-03);
    padding: calc(var(--aria) / 2);
    padding-bottom: 0;
    display: flex;
    flex-flow: row wrap;
    border-radius: 0 0 var(--round-s) var(--round-s);
  }

  .color {
    border-radius: var(--round-s);
    height: var(--input-h);
  }

  .color:hover {
    border: 2px solid var(--cds-text-01);
  }

  p {
    margin: 0;
    margin-top: 0.3em;
  }

  .color-option {
    width: var(--input-h);
    margin-right: calc(var(--aria) / 2);
    border: 1px solid var(--cds-ui-01);
    margin-bottom: calc(var(--aria) / 2);
  }

  .color-current {
    display: block;
    width: 100%;
    border: none;
  }

  .container {
    display: flex;
    flex-direction: row nowrap;
    margin-bottom: var(--aria);
  }

  .container:last-child {
    margin-bottom: 0;
  }

  .buttons {
    flex-basis: 60%;
    max-width: 180px;
    margin-left: var(--aria);
  }
</style>
