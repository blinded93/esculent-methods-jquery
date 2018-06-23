class ChangeQuantityTypeToIngredientAmount < ActiveRecord::Migration[5.2]
  def change
    change_column :ingredient_amounts, :quantity, :float
  end
end
