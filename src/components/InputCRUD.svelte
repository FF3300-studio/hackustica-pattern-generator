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
  {#each array as item}
    <div class="row">
      <p>{item}</p>
      <button
        on:click={() => {
          array = array.filter((i) => i !== item);
          dispatchUpdate();
        }}>-</button
      >
    </div>
  {/each}
  <div class="row">
    <input type="number" bind:value={add} />
    <button
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

  .row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    border-top: 1px solid black;
    padding: 5px 0;
  }

  button {
    width: 2em;
  }
</style>
