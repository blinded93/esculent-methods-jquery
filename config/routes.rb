Rails.application.routes.draw do
  root 'home#index'
  # resources :ingredient_amounts
  # resources :ingredients
  resources :recipes, only: [:index]
  resources :users, except: [:index, :show] do
    get '/recipes' => 'users#show'
    resources :recipes, except: [:index, :new, :edit]
  end
end
