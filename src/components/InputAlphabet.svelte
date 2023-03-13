<script lang="ts">
  import letters from "../lib/letters.json";

  export let alfabeti: Array<string> = [];

  const keys = Object.keys(letters);
</script>

<div>
  {#each keys as key}
    <label>
      <input
        type="checkbox"
        bind:group={alfabeti}
        name="flavours"
        value={key}
      />
      {key}
    </label>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-flow: column nowrap;
  }
</style>
