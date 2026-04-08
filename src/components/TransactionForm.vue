<template>
  <div class="transaction-form">
    <div class="type-toggle">
      <button :class="{ active: type === 'expense' }" @click="type = 'expense'">
        Expense
      </button>
      <button :class="{ active: type === 'income' }" @click="type = 'income'">
        Income
      </button>
    </div>
    <div class="form-row">
      <input type="date" v-model="date" />
      <input type="number" v-model="amount" placeholder="Amount" />
    </div>
    <CategorySelect
      v-model="category"
      :categories="type === 'expense' ? expenseCategories : incomeCategories"
    />
    <input type="text" v-model="detailCategory" placeholder="Detail category" />
    <textarea v-model="memo" placeholder="Memo"></textarea>
    <div class="form-buttons">
      <button @click="save">Save</button>
      <button @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '../stores/categoryStore';
import { useBudgetStore } from '../stores/budgetStore';
import { storeToRefs } from 'pinia';
import CategorySelect from './CategorySelect.vue';

const props = defineProps({
  transactionId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['saved', 'cancel']);

const categoryStore = useCategoryStore();
const budgetStore = useBudgetStore();
const { incomeCategories, expenseCategories } = storeToRefs(categoryStore);

const type = ref('expense');
const date = ref('');
const amount = ref('');
const category = ref('');
const detailCategory = ref('');
const memo = ref('');

onMounted(async () => {
  await categoryStore.fetchCategories();
  if (props.transactionId) {
    const data = await budgetStore.fetchById(props.transactionId);
    type.value = data.type;
    date.value = data.date;
    amount.value = data.amount;
    category.value = data.category;
    detailCategory.value = data.detailCategory;
    memo.value = data.memo;
  }
});

const save = async () => {
  const data = {
    type: type.value,
    date: date.value,
    amount: Number(amount.value),
    category: category.value,
    detailCategory: detailCategory.value,
    memo: memo.value,
  };
  if (props.transactionId) {
    await budgetStore.update(props.transactionId, data);
  } else {
    await budgetStore.create(data);
  }
  emit('saved');
};
</script>
