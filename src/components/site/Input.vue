<template>
    <div class="campo-grupo">
        <label :for="id">{{ label }} <span v-if="required" class="obrigatorio">*</span></label>
        <select v-if="type === 'select'" :id="id" :value="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)" :required="required">
            <slot></slot>
        </select>
        <textarea v-else-if="type === 'textarea'" :id="id" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" :placeholder="placeholder"
            :required="required" :rows="rows">
    </textarea>
        <input v-else :type="type" :id="id" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            :required="required">
        <span v-if="erro" class="erro-mensagem">{{ erro }}</span>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Input',
    props: {
        label: { type: String, required: true },
        modelValue: { type: String, required: true },
        id: { type: String, required: true },
        type: { type: String, default: 'text' },
        placeholder: { type: String, default: '' },
        required: { type: Boolean, default: false },
        rows: { type: String, default: '3' },
        erro: { type: String, default: '' }
    },
    emits: ['update:modelValue']
}
</script>

<style scoped>
.campo-grupo {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    width: 100%;
}

label {
    margin-bottom: 0.5rem;
    color: var(--cor-texto);
    font-weight: 600;
    font-size: 18px;
    text-align: left;
}

input,
select,
textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--cor-secundaria);
    border-radius: 8px;
    font-size: 16px;
    font-family: var(--fonte-principal);
    background-color: var(--cor-texto);
    box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: var(--cor-primaria);
    box-shadow: 0 0 5px rgba(6, 30, 41, 0.2);
}

textarea {
    resize: vertical;
}

.obrigatorio {
    color: #e74c3c;
    margin-left: 2px;
}

.erro-mensagem {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
    font-weight: 500;
}
</style>