Rails.application.routes.draw do
  root 'home#index'
  post '/search' => 'search#index'
  post '/login' => 'sessions#create'
  post '/signup' => 'users#create'
  delete '/logout' => 'sessions#destroy'
  get '/current_user' => 'sessions#current_session_user'
  resources :recipes, only: [:index] do
    get '/favorited' => 'recipes#favorited'
    post '/favorite' => 'recipes#favorite'
  end
  resources :users, except: [:index] do
    get '/recipes' => 'users#recipes'
    get '/favorites' => 'users#favorites'
    get '/friends' => 'users#friends'
    resources :recipes, except: [:index, :new, :edit]
  end
end
