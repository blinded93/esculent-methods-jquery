class CreateIngredientAmounts < ActiveRecord::Migration[5.2]
  def change
    create_table :ingredient_amounts do |t|
      t.string :unit
      t.integer :quantity
      t.references :ingredient
      t.references :recipe

      t.timestamps
    end
  end
end
