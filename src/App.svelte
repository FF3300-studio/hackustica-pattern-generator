<script lang="ts">
  import InputColorMode from "./components/InputColorMode.svelte";
  import InputGroup from "./components/InputGroup.svelte";
  import InputInteger from "./components/InputInteger.svelte";
  import InputItem from "./components/InputItem.svelte";
  import InputRadio from "./components/InputRadio.svelte";
  import InputSelect from "./components/InputSelect.svelte";

  let canvas_wdt = 500;
  const canvas_wdt_id = "canvas_width";
  let canvas_hgt = 700;
  const canvas_hgt_id = "canvas_height";

  let grid_rows = 10;
  const grid_rows_id = "grid_rows";
  let grid_cols = 20;
  const grid_cols_id = "grid_columns";

  let cell_ratio = 0.75;
  const cell_ratio_id = "cell_ratio";

  const colors = [
    { value: "#ffffff", text: "Bianco" },
    { value: "#000000", text: "Nero" },
    { value: "#3366ff", text: "Azzurro" },
    { value: "#66ff99", text: "Verde" },
    { value: "#ff6666", text: "Rosso" },
  ];

  const tiles = [
    { value: "line", text: "Linea", color: 2 },
    { value: "wave", text: "Onda", color: 3 },
    { value: "peak", text: "Picco", color: 4 },
  ];

  let line_num = 1;
  let wave_num = 1;
  let peak_num = 1;

  const color_modes = [
    { value: "tile", text: "Un colore per forma" },
    { value: "distribution", text: "Distribuzione indipendente dalla forma" },
  ];

  let bg_color_mode = color_modes[1].value;
  let fg_color_mode = color_modes[0].value;

  // const bg_tile_preset = {

  // }

  let cd1 = [1, 2, 4, 5, 6];
  let cd3 = [3, 5, 2, 9, 1];

  const color_background_select_id = "bg_color_id";
</script>

<div>
  <!-- Canvas -->
  <InputGroup label={"Tavola disegno"}>
    <!--  -->
    <InputItem>
      <label for={canvas_wdt_id}>Larghezza</label>
      <InputInteger id={canvas_wdt_id} bind:value={canvas_wdt} />
    </InputItem>
    <!--  -->
    <InputItem>
      <label for={canvas_hgt_id}>Altezza</label>
      <InputInteger id={canvas_hgt_id} bind:value={canvas_hgt} />
    </InputItem>
  </InputGroup>

  <!-- Grid -->
  <InputGroup label={"Griglia"}>
    <!--  -->
    <InputItem>
      <label for={grid_rows_id}>Righe</label>
      <InputInteger id={grid_rows_id} bind:value={grid_rows} />
    </InputItem>
    <!--  -->
    <InputItem>
      <label for={grid_cols_id}>Colonne</label>
      <InputInteger id={grid_cols_id} bind:value={grid_cols} />
    </InputItem>
  </InputGroup>

  <!-- Densità -->
  <InputGroup label={"Densità forme"}>
    {#each tiles as tile}
      <InputItem>
        <label for="{tile.value}-num">{tile.text}</label>
        <InputInteger id="{tile.value}-num" bind:value={line_num} />
      </InputItem>
    {/each}
  </InputGroup>

  <!-- Colore tiles -->
  <InputGroup label={"Colore forme"}>
    <InputColorMode
      {colors}
      color_mode={fg_color_mode}
      {color_modes}
      {tiles}
      bind:cd={cd1}
    />
  </InputGroup>
  <p>{cd1}</p>

  <!-- Colore sfondo -->
  <InputGroup label={"Colore sfondo"}>
    <InputColorMode
      {colors}
      color_mode={bg_color_mode}
      {color_modes}
      {tiles}
      bind:cd={cd3}
    />
  </InputGroup>
</div>
