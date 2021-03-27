<script lang="ts">
  export let array: Array<number>;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function dispatchUpdate() {
    dispatch("update");
  }

  let add: number;
</script>

<div>
  <div class="columns">
    {#each array as item}
      <div class="row">
        <p>{item}</p>
        <button
          class="button-main"
          on:click={() => {
            array = array.filter((i) => i !== item);
            dispatchUpdate();
          }}>-</button
        >
      </div>
    {/each}
  </div>
  <div class="row row-input">
    <input class="input__number" type="number" bind:value={add} />
    <button
      class="button-main"
      on:click={() => {
        array = [...array, add];
        dispatchUpdate();
      }}>+</button
    >
  </div>
</div>

<style>
  p {
    margin: 0;
  }

  button {
    width: var(--input-h);
  }

  .columns {
    columns: 2;
    column-gap: calc(var(--aria) * 2);
  }

  .row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    break-inside: avoid;

    padding: 5px 0;
  }

  .row-input {
    margin-top: var(--aria);
  }

  input {
    flex-grow: 1;
    margin-right: var(--aria);
  }
</style>
